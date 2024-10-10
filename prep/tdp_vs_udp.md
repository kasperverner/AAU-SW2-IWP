# TCP (Transmission Control Protocol)

TCP is a connection-oriented protocol, which means it establishes a connection between sender and receiver before data transfer.

It provides reliable delivery services by keeping track of the segments being transmitted or received1.

TCP implements flow control to limit the rate at which data is transferred, and it also has an error control mechanism for reliable data transfer.

It takes into account the level of congestion in the network.

However, TCP is slower than UDP and takes more bandwidth1. It’s not suitable for Local Area Network (LAN) and Personal Area Network (PAN) networks.

# UDP (User Datagram Protocol)

Unlike TCP, UDP is a connectionless protocol, which means there’s no need to establish a connection before data transfer.

It’s used for simple request-response communication when the size of data is less, and there’s less concern about flow and error control.

UDP is suitable for multicasting as it supports packet switching.

It’s normally used for real-time applications which cannot tolerate uneven delays between sections of a received message.
However, UDP is less reliable than TCP.

In summary, TCP is used when reliability is crucial, while UDP is used when speed is more important than reliability. I hope this helps! Let me know if you have any other questions.