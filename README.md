# Chat Platform

This chat app is no ordinary chat app - It's designed to work under the demanding hand of a proxy-controlled intranet spread across an entire country.

The DET enforces schools to use a proxy to restrict internet access to students to ensure online safety, however, this setup prevents students from being able to make use of this vast resource called the internet.
This chat platform is actually a HTTP-based VPN with a chat interface built in so students spread across this vast nation have a means of communicating. It works by squeezing itself into the local network, behind the proxy meaning nothing is sent/retrieved from the outside world.
instead all internet traffic who's destination is outside will be forwarded to a public network where the request can be made without having to worry about the proxy.

Since the chat application itself never leaves the *School Grounds* in other words, never reaches for the outside world, nothing has to pass through the proxy, meaning there's nothing it can do about it. Instead we exploit the intranet-like setup of the DET and allow students who have joined this network to connect to the server.