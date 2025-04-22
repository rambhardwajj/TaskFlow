class ApiResponse {
    success: boolean 
  constructor(public statusCode: number, public data: any  ) {
    this.success = statusCode < 400;
    this.data = data 
  }
}

export { ApiResponse };
