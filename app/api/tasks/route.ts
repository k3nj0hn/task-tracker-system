import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const tasks: any[] = []
const users: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userEmail = searchParams.get("userEmail")

  if (userEmail) {
    // Return tasks for specific user
    const userTasks = tasks.filter((task) => task.assignedStaff === userEmail)
    return NextResponse.json(userTasks)
  }

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newTask = {
      ...body,
      id: generateTaskId(),
      lastUpdate: new Date().toISOString(),
    }

    tasks.push(newTask)

    // Send email notification
    await sendEmailNotification(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      lastUpdate: new Date().toISOString(),
    }

    // Send email notification for updates
    await sendEmailNotification(tasks[taskIndex], "update")

    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

function generateTaskId(): string {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")
  const taskCount = tasks.filter((task) => task.id.startsWith(dateStr)).length + 1
  return `${dateStr}-${taskCount.toString().padStart(4, "0")}`
}

async function sendEmailNotification(task: any, type = "new") {
  // Email notification logic would go here
  // This would integrate with your email service (SendGrid, Nodemailer, etc.)
  console.log(`Sending ${type} notification for task ${task.id} to ${task.assignedStaff}`)
}
