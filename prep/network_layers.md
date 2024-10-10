# Network layers

## Application Layer

This is the topmost layer of the OSI model. It provides a set of interfaces for applications to obtain access to networked services as well as access to the kinds of network services that support applications directly.

## Transport Layer

This layer provides transparent transfer of data between end systems. It’s responsible for end-to-end error recovery and flow control. It ensures complete data transfer.

## Network Layer

This layer is responsible for the delivery of individual packets from the source host to the destination host. It handles routing and forwarding packets, and manages network congestion.

## Data Link Layer

This layer is responsible for node-to-node data transfer. It provides error detection and correction to ensure data arrives at its destination without errors.

## Physical Layer

This is the lowest layer of the OSI model. It’s responsible for the transmission and reception of unstructured raw bit stream over a physical medium. It defines the electrical and physical specifications of the data connection.

--

1 Performing iterative DNS lookups                              Application Layer
2 Determine the route of a datagram                             Network Layer
3 Adding link-layer header to a datagram                        Link Layer
4 Forwarding an IP Packet                                       Network Layer
5 Sending data on a stream-oriented socket                      Application Layer
6 Send data-frames from a router to its neighbor                Link Layer
7 Moving bits on twisted copper wires                           Physical Layer
8 Decrypting a password                                         Application Layer
9 Performing flow-control in the transmission control protocol  Transport Layer
10 Multiplexing data from different sockets                     Transport Layer

--

**Data**: This is the raw information that is being transmitted from the appplication layer.

**Segment**: This is the unit of data at the transport layer. If the protocol is TCP, we call it a segment. If the protocol is UDP, we call it a datagram.

**Datagram**: This is the unit of data at the network layer. It is the packet that is transmitted over the network.

**Packet**: This is the unit of data at the data link layer. It is the frame that is transmitted over the network.

**Frame**: This is the unit of data at the physical layer. It is the bit that is transmitted over the network.

--
