# User journey

We need to describe how the user journey will be.
What kind of users will be there inside the application
and what will be their applicable operations.

## User modes

Users will be operating under certain modes.
Each mode will describe their privileges and responsibilities.

### Admin

This users basically arrives at a page as its first user. This guy gets
to add a password to their page.

### Normie

In a normie mode, a tries to get in a page which already has an admin.
This person needs to enter the password before accessing the content page.

## Life cycle of a page

_We will add more details here..._

However, tentatively the content of a page will live as long as
the content rests on the node of at least one user. This should
be feasible since we are operating with [Web-RTC](https://webrtc.org/)

However, a page has no active user, Collab will attempt to delete the
page along with its contents.

## Lifetime of a user profile

A user is mapped against a page. That means the combination
of user and page should be unqique.
Therefore we cannot have same user name on the same page. However, you can have
same users across multiple page.

Collab will also attempt to delete the user profile completely once the
page is destroyed.
