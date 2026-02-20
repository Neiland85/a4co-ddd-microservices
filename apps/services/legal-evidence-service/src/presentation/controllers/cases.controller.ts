import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { GenerateReportUseCase } from '../../application/use-cases/generate-report.use-case.js';
import { GetCaseAccessLogUseCase } from '../../application/use-cases/get-case-access-log.use-case.js';
import { GenerateReportRequestDto } from '../dtos/generate-report-request.dto.js';
import { ReportResponseDto } from '../dtos/report-response.dto.js';
import { AccessLogResponseDto } from '../dtos/access-log-response.dto.js';

@Controller('cases')
export class CasesController {
  constructor(
    private readonly generateReportUseCase: GenerateReportUseCase,
    private readonly getCaseAccessLogUseCase: GetCaseAccessLogUseCase,
  ) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  async generateReport(
    @Param('id') caseId: string,
    @Body() dto: GenerateReportRequestDto,
    @Req() req: Request & { tenantId?: string },
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ReportResponseDto> {
    try {
      if (!req.tenantId) {
        throw new ForbiddenException('Tenant context is required');
      }
      const result = await this.generateReportUseCase.execute({
        caseId,
        requestedBy: dto.requestedBy,
        tenantId: req.tenantId,
        correlationId,
      });

      const { report } = result;
      const response: ReportResponseDto = {
        id: report.id,
        caseId: report.caseId,
        reportType: report.reportType,
        requestedBy: report.requestedBy,
        status: report.status,
        storageUrl: report.storageUrl,
        requestedAt: report.requestedAt.toISOString(),
      };

      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get(':id/access-log')
  @HttpCode(HttpStatus.OK)
  async getAccessLog(@Param('id') caseId: string): Promise<AccessLogResponseDto[]> {
    const logs = await this.getCaseAccessLogUseCase.execute(caseId);
    return logs.map((log) => ({
      userId: log.userId,
      caseId: log.caseId,
      evidenceId: log.evidenceId,
      action: log.action,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      timestampUtc: log.timestampUtc.toISOString(),
    }));
  }
}
