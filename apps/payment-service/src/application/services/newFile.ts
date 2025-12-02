describe('PaymentService', () => {
    describe('getPaymentById', () => {
        it('should return payment by id', async () => {
            // ✅ Usar un UUID válido en lugar de 'pay_123'
            const validPaymentId = '550e8400-e29b-41d4-a716-446655440000';

            const mockPayment = {
                id: validPaymentId,
                orderId: 'order_123',
                amount: 10000,
                currency: 'EUR',
                status: 'succeeded',
                customerId: 'customer_123',
                createdAt: new Date(),
                updatedAt: new Date(),
                toPrimitives: jest.fn().mockReturnValue({
                    id: validPaymentId,
                    orderId: 'order_123',
                    amount: 10000,
                    currency: 'EUR',
                    status: 'succeeded',
                    customerId: 'customer_123',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }),
            };

            mockPaymentRepository.findById.mockResolvedValue(mockPayment);

            // ✅ Pasar el UUID válido
            const result = await service.getPaymentById(validPaymentId);

            expect(result).toEqual(mockPayment);
            expect(mockPaymentRepository.findById).toHaveBeenCalled();
        });
    });
});
