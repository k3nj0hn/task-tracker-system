"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { LogOut, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  dateAssigned: string
  description: string
  assignedStaff: string
  area: string
  deadline: string
  status: string
  completed: number
  lastUpdate: string
  remarks: string
  quality: number
  efficiency: number
  timeliness: number
  supervisorNotes: string
  overall: string
}

export default function MemberDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "20241221-0001",
      dateAssigned: "2024-12-21",
      description: "Repair air conditioning unit in Building A",
      assignedStaff: "John Doe",
      area: "Building A - 2nd Floor",
      deadline: "2024-12-25",
      status: "In Progress",
      completed: 60,
      lastUpdate: "2024-12-21 14:30",
      remarks: "Parts ordered, waiting for delivery",
      quality: 0,
      efficiency: 0,
      timeliness: 0,
      supervisorNotes: "",
      overall: "Pending",
    },
  ])
  const [userEmail] = useState("john@example.com") // This would come from auth
  const [congratsMessage, setCcongratsMessage] = useState("")

  const updateTask = (taskId: string, field: string, value: any) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, [field]: value, lastUpdate: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : task,
      ),
    )
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  // Check for congratulations message
  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.overall === "Done")
    if (completedTasks.length > 0) {
      setCcongratsMessage("Congratulations! Good Job!")
      setTimeout(() => setCcongratsMessage(""), 5000)
    }
  }, [tasks])

  const myTasks = tasks.filter((task) => task.assignedStaff === "John Doe") // Filter by logged-in user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Congratulations Message */}
      {congratsMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mx-4 mt-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">{congratsMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">My Tasks</CardTitle>
              <div className="text-2xl font-bold text-gray-900">{myTasks.length}</div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              <div className="text-2xl font-bold text-green-600">
                {myTasks.filter((t) => t.status === "Completed").length}
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
              <div className="text-2xl font-bold text-blue-600">
                {myTasks.filter((t) => t.status === "In Progress").length}
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              <div className="text-2xl font-bold text-orange-600">
                {myTasks.filter((t) => t.status === "Not Started").length}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Task Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Assigned Tasks</h2>

          {myTasks.map((task) => (
            <Card key={task.id} className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.id}</CardTitle>
                    <CardDescription className="mt-1">{task.description}</CardDescription>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Area: {task.area}</span>
                      <span>Assigned: {task.dateAssigned}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Due: {task.deadline}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === "Completed" ? "default" : task.status === "In Progress" ? "secondary" : "outline"
                    }
                    className="rounded-full"
                  >
                    {task.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={task.status} onValueChange={(value) => updateTask(task.id, "status", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">% Completed</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={task.completed}
                        onChange={(e) => updateTask(task.id, "completed", Number.parseInt(e.target.value) || 0)}
                        className="rounded-xl"
                      />
                      <Progress value={task.completed} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Remarks / Issues</label>
                  <Textarea
                    value={task.remarks}
                    onChange={(e) => updateTask(task.id, "remarks", e.target.value)}
                    placeholder="Add any remarks or issues encountered..."
                    className="rounded-xl"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Last Updated: {task.lastUpdate}</span>
                  {task.supervisorNotes && (
                    <div className="flex items-center text-blue-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Supervisor Notes Available
                    </div>
                  )}
                </div>

                {task.supervisorNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-sm font-medium text-blue-800">Supervisor Notes:</p>
                    <p className="text-sm text-blue-700 mt-1">{task.supervisorNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {myTasks.length === 0 && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
                <p className="text-gray-500">You don't have any tasks assigned at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
