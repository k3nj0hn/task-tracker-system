"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, LogOut, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { storage } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

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

interface User {
  id: string
  name: string
  email: string
  department: string
  status: "pending" | "approved" | "rejected"
  isOnline: boolean
}

export default function OperatorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [deadlineDate, setDeadlineDate] = useState<Date>()
  const [showAddTask, setShowAddTask] = useState(false)
  const [staffList, setStaffList] = useState(["John Doe", "Jane Smith", "Mike Johnson"])
  const [newStaff, setNewStaff] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = () => {
    const savedTasks = storage.getTasks()
    const savedUsers = storage.getUsers()
    setTasks(savedTasks)
    setUsers(savedUsers)
  }

  const generateTaskId = () => {
    const today = new Date()
    const dateStr = format(today, "yyyyMMdd")
    const taskCount = tasks.filter((task) => task.id.startsWith(dateStr)).length + 1
    return `${dateStr}-${taskCount.toString().padStart(4, "0")}`
  }

  const addTask = () => {
    if (!newTask.description || !newTask.assignedStaff || !selectedDate || !deadlineDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const task: Task = {
      id: generateTaskId(),
      dateAssigned: format(selectedDate, "yyyy-MM-dd"),
      description: newTask.description || "",
      assignedStaff: newTask.assignedStaff || "",
      area: newTask.area || "",
      deadline: format(deadlineDate, "yyyy-MM-dd"),
      status: "Not Started",
      completed: 0,
      lastUpdate: format(new Date(), "yyyy-MM-dd HH:mm"),
      remarks: "",
      quality: 0,
      efficiency: 0,
      timeliness: 0,
      supervisorNotes: "",
      overall: "Pending",
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    storage.saveTasks(updatedTasks)

    setNewTask({})
    setSelectedDate(undefined)
    setDeadlineDate(undefined)
    setShowAddTask(false)

    toast({
      title: "Task created",
      description: `Task ${task.id} has been created successfully.`,
    })
  }

  const addStaff = () => {
    if (newStaff && !staffList.includes(newStaff)) {
      setStaffList([...staffList, newStaff])
      setNewStaff("")
      toast({
        title: "Staff added",
        description: `${newStaff} has been added to the staff list.`,
      })
    }
  }

  const approveUser = (userId: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status: "approved" as const } : user))
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)
    toast({
      title: "User approved",
      description: `${user?.name} has been approved and can now access the system.`,
    })
  }

  const rejectUser = (userId: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status: "rejected" as const } : user))
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)
    toast({
      title: "User rejected",
      description: `${user?.name}'s access request has been rejected.`,
      variant: "destructive",
    })
  }

  const handleLogout = () => {
    storage.removeItem("isLoggedIn")
    storage.removeItem("userEmail")
    storage.removeItem("userRole")
    window.location.href = "/"
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Task Tracker - Operator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="tasks" className="rounded-lg">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
              <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a new task to the tracking system</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Task Description</Label>
                      <Textarea
                        placeholder="Enter task description"
                        value={newTask.description || ""}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Area/Section</Label>
                      <Input
                        placeholder="Enter area or section"
                        value={newTask.area || ""}
                        onChange={(e) => setNewTask({ ...newTask, area: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Staff</Label>
                      <Select onValueChange={(value) => setNewTask({ ...newTask, assignedStaff: value })}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList.map((staff) => (
                            <SelectItem key={staff} value={staff}>
                              {staff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Assigned</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadlineDate ? format(deadlineDate, "PPP") : "Pick deadline"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl">
                          <Calendar mode="single" selected={deadlineDate} onSelect={setDeadlineDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setShowAddTask(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button onClick={addTask} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Task Table */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Assigned
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Staff
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Area/Section
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No tasks created yet. Click "Add New Task" to get started.
                          </td>
                        </tr>
                      ) : (
                        tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.dateAssigned}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{task.description}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedStaff}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.area}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.deadline}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge
                                variant={task.status === "Completed" ? "default" : "secondary"}
                                className="rounded-full"
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.completed}%</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new staff member"
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  className="rounded-xl"
                />
                <Button onClick={addStaff} className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.length === 0 ? (
                <Card className="rounded-2xl shadow-sm col-span-full">
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">No user registration requests yet.</p>
                  </CardContent>
                </Card>
              ) : (
                users.map((user) => (
                  <Card key={user.id} className="rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <div className="flex items-center space-x-2">
                          {user.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          <Badge
                            variant={
                              user.status === "approved"
                                ? "default"
                                : user.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="rounded-full"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <p className="text-sm text-gray-600 mb-4">{user.department}</p>
                      {user.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectUser(user.id)}
                            className="flex-1 rounded-xl"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500">Total Tasks</div>
                  <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter((t) => t.status === "Completed").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t) => t.status === "In Progress").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500">Pending Users</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter((u) => u.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">System Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Version</span>
                      <span className="text-sm font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Tasks</span>
                      <span className="text-sm font-medium">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Users</span>
                      <span className="text-sm font-medium">{users.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Storage</span>
                      <Badge variant="outline" className="rounded-full">
                        Local Storage
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
