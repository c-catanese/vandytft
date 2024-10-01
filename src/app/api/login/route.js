import bcrypt from 'bcrypt';
import sql from '../config/postgresConfig'; 

export async function POST(request) {
  const body = await request.json();
  const { password, email } = body;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Query the database to find the user by email
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      throw new Error('Invalid email or password');
    }

    const userRecord = user[0];

    // Compare the provided password with the hashed password stored in the database
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
