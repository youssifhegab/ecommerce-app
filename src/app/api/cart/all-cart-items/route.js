import connectToDb from '@/database';
import AuthUser from '@/middleware/AuthUser';
import Cart from '@/models/cart';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectToDb();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id)
        return NextResponse.json({
          success: false,
          message: 'Please login in!',
        });
      const extractAllCartItems = await Cart.find({ userID: id }).populate('productID');
      const filteredCartItems = extractAllCartItems.filter(item => !!item.productID);

      if (filteredCartItems) {
        return NextResponse.json({ success: true, data: filteredCartItems });
      } else {
        return NextResponse.json({
          success: false,
          message: 'No Cart items are found !',
          status: 204,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'You are not authenticated',
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: 'Something went wrong ! Please try again',
    });
  }
}
