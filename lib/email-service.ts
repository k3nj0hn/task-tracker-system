// Email service for sending notifications
export class EmailService {
  private static operatorEmail = "kevinetrata04@gmail.com"

  static async sendTaskNotification(task: any, type: "new" | "update" | "completion") {
    const subject = this.getEmailSubject(type, task)
    const body = this.getEmailBody(type, task)

    // In production, integrate with email service like SendGrid, Nodemailer, etc.
    console.log(`Sending email to ${task.assignedStaff}:`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)

    // Mock email sending
    return Promise.resolve({ success: true })
  }

  static async sendApprovalEmail(user: any) {
    const subject = "Account Approved - Task Tracker System"
    const body = `
      Dear ${user.name},
      
      Your account has been approved for the Task Tracker System.
      You can now log in using your credentials.
      
      Best regards,
      Engineering & General Services Team
    `

    console.log(`Sending approval email to ${user.email}`)
    return Promise.resolve({ success: true })
  }

  static async sendOperatorNotification(message: string) {
    console.log(`Sending notification to operator (${this.operatorEmail}): ${message}`)
    return Promise.resolve({ success: true })
  }

  private static getEmailSubject(type: string, task: any): string {
    switch (type) {
      case "new":
        return `New Task Assigned: ${task.id}`
      case "update":
        return `Task Updated: ${task.id}`
      case "completion":
        return `Task Completed: ${task.id}`
      default:
        return `Task Notification: ${task.id}`
    }
  }

  private static getEmailBody(type: string, task: any): string {
    const baseInfo = `
      Task ID: ${task.id}
      Description: ${task.description}
      Area: ${task.area}
      Deadline: ${task.deadline}
      Status: ${task.status}
      Progress: ${task.completed}%
    `

    switch (type) {
      case "new":
        return `A new task has been assigned to you:\n\n${baseInfo}`
      case "update":
        return `Task has been updated:\n\n${baseInfo}\n\nRemarks: ${task.remarks}`
      case "completion":
        return `Congratulations! Task completed:\n\n${baseInfo}`
      default:
        return baseInfo
    }
  }
}
