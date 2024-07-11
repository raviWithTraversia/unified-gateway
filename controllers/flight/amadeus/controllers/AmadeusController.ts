// import { Request, Response } from 'express';
// import AmadeusService from '../services/AmadeusService';

class AmadeusController {
  static async getFlights(req: Request, res: Response) {
    try {
    //   const flights = await AmadeusService.getFlights();
    //   res.json(flights);
    } catch (error) {
     // res.status(500).json({ error: error.message });
    }
  }

  static async createBooking(req: Request, res: Response) {
    try {
    //   const booking = await AmadeusService.createBooking(req.body);
    //   res.json(booking);
    } catch (error) {
      //res.status(500).json({ error: error.message });
    }
  }
}

export default AmadeusController;
