describe('setupTests', () => {
  it('should import setupTests', () => {
    expect(global.__SETUP_CALLED__).toBe(true)
  })
})
