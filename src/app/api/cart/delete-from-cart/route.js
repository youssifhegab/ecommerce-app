import connectToDb from '@/database';
import AuthUser from '@/middleware/AuthUser';
import Cart from '@/models/cart';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const userID = searchParams.get('userID');
      if (!id)
        return NextResponse.json({
          success: false,
          message: 'Cart Item ID is required',
        });

      const deleteCartItem = await Cart.findByIdAndDelete(id);
      const extractAllCartItems = await Cart.find({ userID }).populate('productID');
      const cartProducts = extractAllCartItems.filter(item => !!item.productID);

      if (deleteCartItem) {
        return NextResponse.json({
          success: true,
          message: 'Cart Item deleted successfully',
          cartProducts,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to delete Cart item ! Please try again.',
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'You are not authenticated',
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong ! Please try again',
    });
  }
}
