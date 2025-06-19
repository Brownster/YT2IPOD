# YT2IPOD

**YT2IPOD** is a simple Chrome extension that sends the currently open YouTube video to a self-hosted API so you can convert it for offline listening on your iPod. Think of it as a quick bridge between YouTube and your iPod dock.

The extension works hand-in-hand with the [ipod-dock](https://github.com/Brownster/ipod-dock) project, a Raspberry Pi based service that handles conversions and syncing. Once the dock is running, the extension lets you queue videos as music, audiobooks or podcasts with a single click.

## Prerequisites

1. A running instance of the **ipod-dock** API. Follow the setup guide in its [repository](https://github.com/Brownster/ipod-dock) to install the service on a Raspberry Pi or other Linux machine.
2. Google Chrome (or any Chromium‑based browser) to load the extension in developer mode.

## Installation

1. Clone this repository or download its ZIP.
2. In Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the `youtube-to-ipod` folder from this repo. The extension should now appear in your toolbar.

## Configuration

Before using the extension, open its **Options** page and enter:

- **Server URL** – the address of your running `ipod-dock` instance, e.g. `http://192.168.1.100:8000`.
- **API Key** – if you configured one on the server, enter it here so requests are authorised.

These settings are stored with Chrome and used whenever you send a video.

## Usage

1. Navigate to a YouTube video page.
2. Click the YT2IPOD icon.
3. Choose **Send as Music**, **Send as Audiobook** or **Send as Podcast**.
4. The extension posts the video URL to your `ipod-dock` server, which handles downloading and converting it for syncing.

A confirmation message will appear when the request is queued successfully.

## Why ipod-dock?

The companion [ipod-dock](https://github.com/Brownster/ipod-dock) project provides a FastAPI server with a dashboard, queue management and automatic syncing to your iPod. Running it on a Raspberry Pi means you can drop files into a queue over Wi‑Fi and keep the dock permanently connected.

YT2IPOD simply acts as a remote control for that server, making it easy to send YouTube content straight to your personal listening library.

---

Feel free to fork the project and suggest improvements. Pull requests are welcome!
