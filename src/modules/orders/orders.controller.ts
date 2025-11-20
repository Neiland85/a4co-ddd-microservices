import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado' })
  create(@Body() createOrderDto: any, @Request() req) {
    return this.ordersService.create({
      ...createOrderDto,
      userId: req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  findAll(@Request() req) {
    // Si es admin, ver todos; si no, solo los propios
    if (req.user.role === 'ADMIN') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido actualizado' })
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido eliminado' })
  remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
