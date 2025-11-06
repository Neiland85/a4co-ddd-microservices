{{/*
Expand the name of the chart.
*/}}
{{- define "a4co.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "a4co.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "a4co.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "a4co.labels" -}}
helm.sh/chart: {{ include "a4co.chart" . }}
{{ include "a4co.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: a4co-microservices
environment: {{ .Values.global.environment }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "a4co.selectorLabels" -}}
app.kubernetes.io/name: {{ include "a4co.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "a4co.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "a4co.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Generate image name
*/}}
{{- define "a4co.image" -}}
{{- $registry := .registry | default $.Values.global.imageRegistry -}}
{{- $repository := .repository -}}
{{- $tag := .tag | default $.Chart.AppVersion -}}
{{- printf "%s/%s:%s" $registry $repository $tag -}}
{{- end }}

{{/*
Generate database connection string
*/}}
{{- define "a4co.databaseUrl" -}}
{{- $host := .Values.global.database.host -}}
{{- $port := .Values.global.database.port -}}
{{- $name := .Values.global.database.name -}}
{{- printf "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@%s:%s/%s" $host ($port | toString) $name -}}
{{- end }}

{{/*
Generate NATS URL
*/}}
{{- define "a4co.natsUrl" -}}
{{- printf "nats://%s:%s" .Values.global.nats.host (.Values.global.nats.port | toString) -}}
{{- end }}

{{/*
Generate Redis URL
*/}}
{{- define "a4co.redisUrl" -}}
{{- printf "redis://%s:%s" .Values.global.redis.host (.Values.global.redis.port | toString) -}}
{{- end }}
