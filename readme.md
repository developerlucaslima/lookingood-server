# Use Cases and Tests

## Users

- 🧪 *User Register*
  - [X] - It should allow to register a user.
  - [X] - It should hash user password upon registration.
  - [X] - It should prevent a user register with a duplicate email.
  - [X] - It should prevent a user register with an invalid service gender.
  - [X] - It should prevent a user register with service gender as blank.
  - [X] - It should validate serviceGender as "MALE".
  - [X] - It should validate serviceGender as "FEMALE".
  - [X] - It should validate serviceGender as "BOTH".
- 🧪 *User Authenticate*
  - [X] - It should allow user authenticate.
  - [X] - It should prevent user authenticate with wrong email.
  - [X] - It should prevent user authenticate with wrong password.
- 🧪 *Get User Profile*
  - [X] - It should allow get user profile.
  - [X] - It should prevent get user profile if user does not exist.

## Establishments

- 🧪 *Establishment Register*
  - [X] - It should allow to register a establishment.
  - [X] - It should hash user password upon registration.
  - [X] - It should prevent a establishment register with a duplicate email.
- 🧪 *Establishment Authenticate*
  - [X] - It should allow establishment authenticate.
  - [X] - It should prevent establishment authenticate with wrong email.
  - [X] - It should prevent establishment authenticate with wrong password.
- 🧪 *Get Establishment Profile*
  - [X] - It should allow get establishment profile.
  - [X] - It should prevent get establishment profile if establishment does not exist.
- 🧪 *Add Establishment Schedule*
  - [X] - It should allow add establishment schedule.
  - [X] - It should prevent to add establishment schedule if the establishment does not exist.
  - [X] - It should prevent add establishment schedule with break if it have not break start or end time.
  - [X] - It should prevent add establishment schedule with negative time parameters.
- 🧪 *Add Professional*
  - [X] - It should allow add professional.
  - [X] - It should prevent add professional if the establishment does not exist.
- 🧪 *Add Professional Schedule*
  - [X] - It should allow add professional schedule.
  - [X] - It should prevent add professional schedule if the professional does not exist.
  - [X] - It should prevent add professional schedule if the establishment does not exist.
  - [X] - It should prevent add professional schedule with break if it have not break start or end time.
  - [X] - It should prevent add professional schedule with negative time parameters.
  - [X] - It should prevent add professional schedule if the establishment does not have opening hours for the given weekday.
  - [X] - It should prevent add professional schedule if the professional's schedule conflicts with the establishment's schedule.
- 🧪 *Add Service*
  - [X] - It should allow add service.
  - [X] - It should prevent add service if the establishment does not exist.
  - [X] - It should prevent adding a service if the duration is not a multiple of 15 minutes.
  - [X] - It should prevent add service if gender is not valid.

## Service Reservations

- 🧪 *Service Reservation*
  - [X] - It should allow service reservation.
  - [X] - It should prevent service reservation if professional does not exist.
  - [X] - It should prevent service reservation if service does not exist.
  - [X] - It should prevent service reservation if user does not exist.
  - [X] - It should prevent service reservation if establishment does not exist.
  - [X] - It should prevent service reservation if the establishment, professional and service does not match.
  - [X] - It should prevent service reservation if there are conflicts in the professional's schedule.
  - [X] - It should prevent service reservation if the professional does not have operating hours for the given time.
- 🧪 *Service Reservation Update*
  - [X] - It should allow service reservation update.
  - [X] - It should prevent service reservation update if the reservation does not exist.
  - [X] - It should prevent service reservation update if the user does not exist.
  - [X] - It should prevent service reservation update if the user does not match the reservation.
  - [X] - It should prevent service reservation update if the service does not exist.
  - [X] - It should prevent service reservation update if it's not within the modification deadline.
  - [X] - It should prevent service reservation update if the professional does not exist.
  - [X] - It should prevent service reservation update if the establishment, professional and service does not match.
  - [X] - It should prevent service reservation update if there are conflicts in the professional's schedule.
  - [X] - It should prevent service reservation update if the professional hasn't operating hours for the given time.
- 🧪 *Service Reservation Confirmation*
  - [X] - It should allow service reservation confirmation.
  - [X] - It should prevent service reservation confirmation if the reservation does not exist.
  - [X] - It should prevent service confirmation update if the establishment does not exist.
  - [X] - It should prevent service reservation confirmation if the establishment does not match the reservation.

## Additional Ideas

- 🔜 *Display Available Time Slots*
  - [ ] - Display available time slots based on establishment and professional schedules.

- 🔜 *Reservation Conflicts*
  - [ ] - Prevent service reservation if the user already has a reservation at the same time.

- 🔜 *User Reservation Management*
  - [ ] - Allow users to cancel or reschedule a booked or confirmed service.
  - [ ] - Allow users to view a list of their services, including status (Confirmed, Checked-out, Waiting for Confirmation).

- 🔜 *Notifications and Confirmations*
  - [ ] - Send booking confirmations via email or app notification.
  - [ ] - Implement a notification system to remind users of their reservations and notify them of any changes or cancellations.
  - [ ] - Notify professionals of changes or cancellations as soon as possible.

- 🔜 *User Feedback*
  - [ ] - Allow users to rate and leave comments about establishments and professionals after the service.

- 🔜 *Security Enhancements*
  - [ ] - Implement two-factor authentication for added security.
  - [ ] - Lock the account after a certain number of failed login attempts.
  - [ ] - Offer "forgot password" functionality with email verification for password reset.

- 🔜 *Social Sharing*
  - [ ] - Allow users to share their reservations and experiences on social networks.

- 🔜 *Promotions and Discounts*
  - [ ] - Allow establishments to offer promotional discounts, packages, and set flexible cancellation policies.
  - [ ] - Provide options for managing service pricing and discounts.

- 🔜 *Commission and Payments*
  - [ ] - Charge a commission fee (e.g., 4%) on bookings at checkout to support the platform.
  - [ ] - Integrate with payment gateways for secure transactions.

- 🔜 *Service Flexibility*
  - [ ] - Allow establishments to offer services at the user's location (at-home), in-salon, or both.
  - [ ] - Allow users to search for establishments based on location and filter by criteria such as service type, availability, and rating.

- 🔜 *Loyalty Program*
  - [ ] - Implement a loyalty program to reward repeat customers (e.g., “book 10 times and get one for free”).

- 🔜 *Multi-Language Support*
  - [ ] - Offer multiple languages for a broader user base.

- 🔜 *Recommendation Engine*
  - [ ] - Use recommendation algorithms to suggest establishments based on user preferences and booking history.

- 🔜 *Registration and Verification*
  - [ ] - Ensure valid email format during registration (e.g., proper domain, includes "@").
  - [ ] - Require strong passwords (e.g., combination of uppercase/lowercase letters, numbers, symbols).
  - [ ] - Send a verification email upon registration.
  - [ ] - Require verification of establishment details (e.g., business license, contact information) before registration approval.

- 🔜 *Service and Professional Management*
  - [ ] - Allow adding multiple professionals with different specializations.
  - [ ] - Set individual professional schedules and availability.
  - [ ] - Allow establishments to view user booking history and preferences.
  - [ ] - Allow communication through the platform for appointment confirmations, rescheduling, or other relevant information.

- 🔜 *Service Details and Filtering*
  - [ ] - Allow filtering and sorting of services based on criteria like date, status, establishment, and professional.
  - [ ] - Display clear and concise information for each service, including details, confirmation status, and payment status.
  - [ ] - Prevent service date changes after a specific time frame (e.g., 24 hours before the appointment).

- ⚡ The application should respond quickly to user requests, even under peak conditions.
- ⚡ The application must protect user and establishment data from unauthorized access.
- ⚡ The application interface should be intuitive and easy to use for all types of users.
- ⚡ The application should be available for use most of the time.
- ⚡ The application should be able to accommodate an increasing number of users and bookings.
- ⚡ The application be tested on different devices and operating systems for compatibility and responsiveness.
- ⚡ The application follow accessibility guidelines to ensure usability for users with disabilities.
- ⚡ The application implement data encryption for user information and secure communication protocols.
