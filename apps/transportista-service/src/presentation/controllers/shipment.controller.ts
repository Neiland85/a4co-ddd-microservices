import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateShipmentUseCase } from '../../application/use-cases/create-shipment.use-case.js';
import { AssignShipmentUseCase } from '../../application/use-cases/assign-shipment.use-case.js';
import { UpdateShipmentStatusUseCase } from '../../application/use-cases/update-shipment-status.use-case.js';
import { ShipmentRepository } from '../../domain/repositories/shipment.repository.js';
import { CreateShipmentDto, UpdateShipmentStatusDto, ShipmentResponseDto } from '../dto/index.js';
import { Inject } from '@nestjs/common';

@ApiTags('shipments')
@Controller('api/v1/shipments')
export class ShipmentController {
  private readonly logger = new Logger(ShipmentController.name);

  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly assignShipmentUseCase: AssignShipmentUseCase,
    private readonly updateShipmentStatusUseCase: UpdateShipmentStatusUseCase,
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shipment created successfully',
    type: ShipmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or shipment already exists',
  })
  async createShipment(@Body() dto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    try {
      const shipment = await this.createShipmentUseCase.execute(dto);
      return this.mapToDto(shipment);
    } catch (error: any) {
      this.logger.error('Error creating shipment', error);
      throw new BadRequestException(error?.message || 'Failed to create shipment');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment found',
    type: ShipmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shipment not found',
  })
  async getShipmentById(@Param('id') id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return this.mapToDto(shipment);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get shipment by order ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment found',
    type: ShipmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shipment not found for this order',
  })
  async getShipmentByOrderId(@Param('orderId') orderId: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findByOrderId(orderId);
    if (!shipment) {
      throw new NotFoundException(`Shipment for order ${orderId} not found`);
    }
    return this.mapToDto(shipment);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign transportista to shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transportista assigned successfully',
    type: ShipmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shipment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot assign transportista',
  })
  async assignShipment(@Param('id') id: string): Promise<ShipmentResponseDto> {
    try {
      const shipment = await this.assignShipmentUseCase.execute({ shipmentId: id });
      return this.mapToDto(shipment);
    } catch (error: any) {
      this.logger.error(`Error assigning shipment ${id}`, error);
      if (error?.message?.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error?.message || 'Failed to assign shipment');
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update shipment status' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status updated successfully',
    type: ShipmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shipment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  async updateShipmentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateShipmentStatusDto,
  ): Promise<ShipmentResponseDto> {
    try {
      const shipment = await this.updateShipmentStatusUseCase.execute({
        shipmentId: id,
        newStatus: dto.status,
        failureReason: dto.failureReason,
        actualDeliveryTime: dto.actualDeliveryTime ? new Date(dto.actualDeliveryTime) : undefined,
      });
      return this.mapToDto(shipment);
    } catch (error: any) {
      this.logger.error(`Error updating shipment ${id} status`, error);
      if (error?.message?.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error?.message || 'Failed to update shipment status');
    }
  }

  private mapToDto(shipment: any): ShipmentResponseDto {
    return {
      id: shipment.id,
      orderId: shipment.orderId,
      transportistaId: shipment.transportistaId,
      status: shipment.status,
      shippingCost: shipment.shippingCost,
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress,
      estimatedDeliveryTime: shipment.estimatedDeliveryTime,
      actualDeliveryTime: shipment.actualDeliveryTime,
      failureReason: shipment.failureReason,
      metadata: shipment.metadata,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };
  }
}
