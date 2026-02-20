import { createHash } from 'crypto';
import { IPdfGenerator, ReportContent } from '../../application/ports/pdf-generator.port.js';
import { EvidenceFile } from '../../domain/entities/evidence-file.entity.js';

/**
 * Generates a minimal valid PDF report without external dependencies.
 * Uses the PDF 1.4 specification to build a well-formed document.
 */
export class MinimalPdfGeneratorService implements IPdfGenerator {
  async generate(content: ReportContent): Promise<Buffer> {
    const text = this.buildReportText(content);
    return this.createPdf(text, content.legalCase.title);
  }

  private buildReportText(content: ReportContent): string[] {
    const { legalCase, evidences, generatedAt, requestedBy } = content;
    const lines: string[] = [];

    lines.push(`INFORME PERICIAL DIGITAL`);
    lines.push(`Generado: ${generatedAt.toISOString()}`);
    lines.push(`Solicitado por: ${requestedBy}`);
    lines.push(``);
    lines.push(`=== DATOS DEL CASO ===`);
    lines.push(`ID: ${legalCase.id}`);
    lines.push(`Titulo: ${legalCase.title}`);
    lines.push(`Descripcion: ${legalCase.description}`);
    lines.push(`Estado: ${legalCase.status}`);
    lines.push(`Apertura por: ${legalCase.openedBy}`);
    lines.push(``);
    lines.push(`=== LISTADO DE EVIDENCIAS (${evidences.length}) ===`);

    for (const evidence of evidences) {
      lines.push(``);
      lines.push(`Evidencia: ${evidence.title}`);
      lines.push(`  ID: ${evidence.id}`);
      lines.push(`  Tipo: ${evidence.evidenceType}`);
      lines.push(`  Estado: ${evidence.status}`);
      lines.push(`  Presentado por: ${evidence.submittedBy}`);

      if (evidence.files.length > 0) {
        lines.push(`  --- HASHES ---`);
        for (const file of evidence.files as EvidenceFile[]) {
          if (file.hashRecord) {
            lines.push(
              `  Archivo: ${file.fileName}  Hash ${file.hashRecord.algorithm}: ${file.hashRecord.hashValue}`,
            );
          }
        }
      }

      if (evidence.custodyChain.length > 0) {
        lines.push(`  --- TIMELINE CUSTODIA ---`);
        for (const event of evidence.custodyChain) {
          lines.push(
            `  [${event.occurredAt.toISOString()}] ${event.fromCustodian ?? 'origen'} -> ${event.toCustodian}: ${event.reason}`,
          );
        }
      }
    }

    lines.push(``);
    lines.push(`=== DECLARACION TECNICA DE INTEGRIDAD ===`);
    const integrityHash = createHash('sha256')
      .update(
        JSON.stringify({
          caseId: legalCase.id,
          evidenceCount: evidences.length,
          generatedAt: generatedAt.toISOString(),
        }),
      )
      .digest('hex');
    lines.push(`Huella de integridad del informe (SHA-256): ${integrityHash}`);
    lines.push(`Este informe fue generado automaticamente por el sistema A4CO.`);
    lines.push(`La integridad de los datos puede verificarse comparando el hash anterior.`);

    return lines;
  }

  private createPdf(lines: string[], title: string): Buffer {
    const safeLines = lines.map((l) => this.escapeForPdf(l));
    const safeTitle = this.escapeForPdf(title);

    // Build PDF text stream content
    const streamLines: string[] = [`BT`];
    streamLines.push(`/F1 10 Tf`);
    let y = 780;
    for (const line of safeLines) {
      if (y < 40) {
        break; // single-page limit for minimal implementation
      }
      streamLines.push(`72 ${y} Td`);
      streamLines.push(`(${line}) Tj`);
      streamLines.push(`72 ${y - 14} Td`); // reset x after Td moves cursor
      y -= 14;
    }
    streamLines.push(`ET`);

    const stream = streamLines.join('\n');
    const streamBytes = Buffer.from(stream, 'latin1');

    // Build PDF objects
    const objs: string[] = [];

    // obj 1: Catalog
    objs.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);
    // obj 2: Pages
    objs.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
    // obj 3: Page
    objs.push(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`,
    );
    // obj 4: Content stream
    objs.push(
      `4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj`,
    );
    // obj 5: Font
    objs.push(
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>\nendobj`,
    );
    // obj 6: Info
    objs.push(
      `6 0 obj\n<< /Title (${safeTitle}) /Creator (A4CO Legal Evidence Service) >>\nendobj`,
    );

    const header = `%PDF-1.4\n`;
    let pdf = header;
    const offsets: number[] = [];

    for (const obj of objs) {
      offsets.push(Buffer.byteLength(pdf, 'latin1'));
      pdf += obj + '\n';
    }

    const xrefOffset = Buffer.byteLength(pdf, 'latin1');
    pdf += `xref\n0 ${objs.length + 1}\n`;
    pdf += `0000000000 65535 f \n`;
    for (const off of offsets) {
      pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info 6 0 R >>\n`;
    pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.from(pdf, 'latin1');
  }

  private escapeForPdf(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E]/g, '?'); // replace non-printable ASCII with '?'
  }
}
