# Microblog

This is a microblog application using Express.js and PostgreSQL. This application allows users to create accounts and publish blogs. Users also have the ability to create and change an about me section. The application keeps track of previous about me sections and allows the user to revert to any previous version at just the click of a button

## Testing

### UAT

The first testing was UAT testing. The application passed the UAT testing with no bugs. 

### Unit Testing

The second round of testing was through Jest, using the supertest library. The Unit testing tests all conditions, including edge cases like user access to resources when signed out.

## Next Steps

Below are the future steps for this project:

- Prevent Race Conditions

- Protect against SQL Injection Attacks

- Use Password Hashing to make software more secure

- Implement analytics for each blog

