import bcrypt from 'bcrypt';
import sql from '../config/postgresConfig'; 

export async function POST(request) {
  const body = await request.json();
  const { password, email } = body;

  // Validate required fields
  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ message: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate password length
  if (password.length < 8) {
    return new Response(JSON.stringify({ message: 'Password must be at least 8 characters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      throw new Error('Invalid email or password');
    }

    const userRecord = user[0];

    const passwordMatch = await bcrypt.compare(password, userRecord.password);

    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const response = new Response(JSON.stringify({
      message: 'Login successful',
      email,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
