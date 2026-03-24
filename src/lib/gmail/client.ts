import { gmail_v1, google } from 'googleapis'

export interface GmailClientConfig {
  accessToken: string
  refreshToken?: string
  clientId?: string
  clientSecret?: string
}

export class GmailClient {
  private gmail: gmail_v1.Gmail
  private accessToken: string
  private refreshToken?: string

  constructor(config: GmailClientConfig) {
    this.accessToken = config.accessToken
    this.refreshToken = config.refreshToken

    const auth = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret
    )

    auth.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    })

    this.gmail = google.gmail({ version: 'v1', auth })
  }

  async listMessages(query: string = '', pageToken?: string) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        pageToken,
        maxResults: 50,
      })
      return response.data
    } catch (error) {
      console.error('Error listing messages:', error)
      throw error
    }
  }

  async getMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      })
      return response.data
    } catch (error) {
      console.error('Error getting message:', error)
      throw error
    }
  }

  async getThread(threadId: string) {
    try {
      const response = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'full',
      })
      return response.data
    } catch (error) {
      console.error('Error getting thread:', error)
      throw error
    }
  }

  async sendMessage(to: string, subject: string, body: string) {
    try {
      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'MIME-Version: 1.0',
        '',
        body,
      ].join('\n')

      const base64Email = Buffer.from(email).toString('base64')

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: base64Email,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async modifyMessage(messageId: string, addLabels?: string[], removeLabels?: string[]) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: addLabels,
          removeLabelIds: removeLabels,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error modifying message:', error)
      throw error
    }
  }

  async trashMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.trash({
        userId: 'me',
        id: messageId,
      })
      return response.data
    } catch (error) {
      console.error('Error trashing message:', error)
      throw error
    }
  }

  async deleteMessage(messageId: string) {
    try {
      await this.gmail.users.messages.delete({
        userId: 'me',
        id: messageId,
      })
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  async getLabels() {
    try {
      const response = await this.gmail.users.labels.list({
        userId: 'me',
      })
      return response.data.labels || []
    } catch (error) {
      console.error('Error getting labels:', error)
      throw error
    }
  }

  async createLabel(name: string) {
    try {
      const response = await this.gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating label:', error)
      throw error
    }
  }
}
