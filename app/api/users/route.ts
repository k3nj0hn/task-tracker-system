import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const users: any[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    status: "approved",
    isOnline: true,
  },
]

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUser = {
      ...body,
      id: Date.now().toString(),
      status: "pending",
      isOnline: false,
    }

    users.push(newUser)

    // Send notification to operator
    await sendOperatorNotification(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    users[userIndex] = { ...users[userIndex], ...updates }

    // Send approval/rejection email
    if (updates.status === "approved") {
      await sendApprovalEmail(users[userIndex])
    }

    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

async function sendOperatorNotification(user: any) {
  // Send email to operator about new user registration
  console.log(`New user registration: ${user.name} (${user.email})`)
}

async function sendApprovalEmail(user: any) {
  // Send approval email to user
  console.log(`Sending approval email to ${user.email}`)
}
