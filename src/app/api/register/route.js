import connectToDb from '@/database';
import User from '@/models/user';
import Joi from 'joi';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export async function POST(req) {
  await connectToDb();
  const { name, email, password, role } = await req.json();
  // validate the schema
  const { error } = schema.validate({ name, email, password, role });

  if (error)
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });

  try {
    // check if the user exists or not

    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists)
      return NextResponse.json({
        success: false,
        message: 'User already exists please try different email',
      });

    const hashPassword = await hash(password, 12);

    const newlyCreatedUser = await User.create({ name, email, password: hashPassword, role });

    if (newlyCreatedUser)
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
      });
  } catch (e) {
    console.log('error in new user registeration, please try again', e);

    return NextResponse.json({
      success: false,
      message: `something went wrong, please try again later: ${e}`,
    });
  }
}
