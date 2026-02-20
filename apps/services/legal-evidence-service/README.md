# Legal Evidence Service

Bounded context responsible for managing digital legal evidence with **cryptographic integrity** and a **real chain of custody**.

---

## Custody Flow

```
Client uploads file
        │
        ▼
EvidenceService.uploadFile()
        │
        ├─ 1. Calculate SHA-256 of file content
        │
        ├─ 2. Create EvidenceFile (with storageUrl)
        │
        ├─ 3. Attach HashRecord (algo=SHA-256, hash, timestampUtc)
        │         → EvidenceFile.status → VERIFIED
        │
        ├─ 4. Record CustodyEvent: EVIDENCE_FILE_UPLOADED
        │         (evidenceId, toCustodian, reason, recordedBy, occurredAt)
        │
        └─ 5. Record CustodyEvent: EVIDENCE_HASHED
                  (includes hash value in reason for audit trail)
```

### Timeline Query

```
GET /evidence/:id/timeline
        │
        ▼
EvidenceService.getTimeline(evidenceId)
        │
        └─ Returns all ChainOfCustodyEvents ordered by occurredAt ASC
```

---

## Cryptographic Integrity Guarantees

| Guarantee | Implementation |
|---|---|
| **SHA-256 hash** | Computed from raw file content via Node.js `crypto.createHash('sha256')` |
| **Deterministic** | Same content always produces the same hash (verified by tests) |
| **Tamper detection** | `HashRecord.verify(other)` compares algorithm + value |
| **Timestamp** | `timestampUtc` (ISO 8601) captured at hash computation time |
| **Stored with file** | `EvidenceFile.hashRecord` holds algorithm, value, and timestamp |

---

## Chain of Custody Guarantees

| Guarantee | Implementation |
|---|---|
| **Append-only** | `ChainOfCustodyEvent` calls `Object.freeze(this)` – no mutation possible at runtime |
| **No update/delete** | `IEvidenceRepository.getCustodyTimeline` is read-only; repository has no `deleteEvent`/`updateEvent` |
| **Automatic on upload** | `Evidence.uploadFile()` always emits `EVIDENCE_FILE_UPLOADED` + `EVIDENCE_HASHED` events atomically |
| **Ordered timeline** | `getTimeline()` sorts events by `occurredAt ASC` |
| **Full audit trail** | `EVIDENCE_HASHED` reason includes the full SHA-256 hash value |

---

## CustodyEventType Values

| Type | When |
|---|---|
| `CUSTODY_TRANSFER` | Manual transfer between custodians |
| `EVIDENCE_FILE_UPLOADED` | A file is attached to an evidence record |
| `EVIDENCE_HASHED` | SHA-256 hash is computed and recorded |
| `EVIDENCE_REVIEWED` | Evidence is reviewed by an officer |
| `EVIDENCE_SEALED` | Evidence is sealed for submission |

---

## Domain Model

```
Evidence (AggregateRoot)
  ├── EvidenceFile[]
  │     ├── id, evidenceId, fileName, mimeType, sizeBytes, storageUrl
  │     ├── hashRecord: HashRecord | null  (null until uploadFile())
  │     └── status: PENDING_VERIFICATION | VERIFIED | REJECTED
  │
  └── ChainOfCustodyEvent[]  (append-only)
        ├── id, evidenceId, eventType, fromCustodian, toCustodian
        ├── reason, recordedBy, occurredAt
        └── [Object.frozen – immutable at runtime]

HashRecord (ValueObject)
  ├── algorithm: 'SHA-256' | 'SHA-512' | 'MD5'
  ├── hashValue: string  (64-char hex for SHA-256)
  ├── computedAt: Date
  └── timestampUtc: string  (ISO 8601)
```

---

## Database Schema

Key models in `prisma/schema.prisma`:

- **`evidence_files`** – stores file metadata (hashAlgo, hashValue, hashDate)
- **`hash_records`** – separate audit table (evidenceFileId, algo, hash, timestampUtc)
- **`chain_of_custody_events`** – append-only log (eventType, occurredAt, indexed)

---

## Running Tests

```bash
npm test               # Run all tests
npm run test:cov       # Run with coverage
npm run type-check     # TypeScript type check
```

### What the tests verify

- **`hash-consistency.spec.ts`**: SHA-256 is deterministic, correct length, matches Node.js crypto output.
- **`custody-append-only.spec.ts`**: Events are frozen at runtime, `uploadFile()` emits exactly two events (UPLOADED + HASHED), duplicate files are rejected.

---

## Manifest Signature Verification

- Every generated forensic manifest now includes:
  - `manifestSignature` (RSA-SHA256, base64)
  - `publicKeyId`
- Service endpoint:
  - `GET /evidence/:id/verify` → returns `true` / `false`

### External verification with OpenSSL

1. Configure key material in the service:
   - `FORENSIC_MANIFEST_PRIVATE_KEY_PEM`
   - `FORENSIC_MANIFEST_PUBLIC_KEY_PEM`
   - Optional: `FORENSIC_MANIFEST_PUBLIC_KEY_ID`
   - Note: `FORENSIC_MANIFEST_PRIVATE_KEY_PEM` is required for signing.
2. Save the manifest payload (without `manifestSignature` and `publicKeyId`) as `manifest.payload.json`.
3. Save `manifestSignature` value (base64) into `manifest.sig.b64`.
4. Run:

```bash
base64 -d manifest.sig.b64 > manifest.sig
openssl dgst -sha256 -verify public.pem -signature manifest.sig manifest.payload.json
```

If OpenSSL returns `Verified OK`, the manifest signature is valid.

---

## Current Limitations

- Hash is computed from in-memory content; large file streaming is not yet implemented.
- No NestJS HTTP controller in place yet; the `EvidenceService` application service acts as the API boundary.
- Prisma repository implementation is not yet wired (interface only).
