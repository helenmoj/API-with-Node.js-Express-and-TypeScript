export {} // needed for this file to be understood as a typescript module, 

declare global {
  namespace Express {
      interface Request {
          treatment?: any
      }
  }
}