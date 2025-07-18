describe('Test básico de configuración', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true);
  });

  it('should be able to use Jest mocks', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
