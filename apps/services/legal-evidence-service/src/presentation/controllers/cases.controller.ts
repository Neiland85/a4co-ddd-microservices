import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GenerateReportUseCase } from '../../application/use-cases/generate-report.use-case.js';
import { GenerateReportRequestDto } from '../dtos/generate-report-request.dto.js';
import { ReportResponseDto } from '../dtos/report-response.dto.js';

@Controller('cases')
export class CasesController {
  constructor(private readonly generateReportUseCase: GenerateReportUseCase) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  async generateReport(
    @Param('id') caseId: string,
    @Body() dto: GenerateReportRequestDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ReportResponseDto> {
    try {
      const result = await this.generateReportUseCase.execute({
        caseId,
        requestedBy: dto.requestedBy,
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
}
