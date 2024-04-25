# TODO: Use Cases and Tests

## Users
- [ ] - ✨ Users must be able *register via email*.
    - [ ] - 🧪 It should not be able to register with same email twice.
    - [ ] - 🧪 It should hash user password upon registration.
    - [ ] - 🧪 It should validate serviceGender as "Male".
    - [ ] - 🧪 It should validate serviceGender as "Female".
    - [ ] - 🧪 It should validate serviceGender as "Both".
    - [ ] - 🧪 It should not be allowed to register service gender unless specified as "Male", "Female" or "Both".
    - [ ] - 🧪 It should not be allowed to register service gender as blank.
- [ ] - ✨ Users must be able *authenticate via email*.
    - [ ] - 🧪 It should not be able to authenticate with wrong email.
    - [ ] - 🧪 It should not be able to authenticate with wrong password. 
- [ ] - ✨ Users must be able to *book services* by selecting an establishment, professional (optional), date, time, and desired service.
    - [ ] - 🧪 It should not be able to book a service with nonexistent professionalId.
    - [ ] - 🧪 It should not be able to book a service with nonexistent serviceId.
    - [ ] - 🧪 It should not be able to book a service with nonexistent userId.
    - [ ] - 🧪 It should not be able to book a service with professional from different establishment.
    - [ ] - 🧪 It should not be able to book a service with any other status than "Waiting for confirmation".
    - [ ] - 🧪 It should not be able to book if the professional is already booked at the same time.
    - [ ] - 🧪 It should not be able to book a service outside of the establishment's operating hours.
    - [ ] - 🧪 It should allow users to book multiple services at the same time if offered by the establishment and time slots do not overlap.
- [ ] - ✨ Users must be able to change a service date.
- [ ] - ✨ Users must be able to cancel a booked service or confirmed service.
- [ ] - ✨ Users must be able to view a list of services with information about whether it is Confirmed, Checked-out, or Waiting for confirmation.
- [ ] - ✨ Users must receive booking confirmation via email or app notification.

## Establishments
- [ ] - ✨ Establishments must be able *register via email*.
    - [ ] - 🧪 It should not be able to register with same email twice.
    - [ ] - 🧪 It should hash user password upon registration.
    - [ ] - 🧪 It should not be allowed to register service gender unless specified as "Male", "Female" or "Both".
    - [ ] - 🧪 It should not be allowed to register service gender as blank.
- [ ] - ✨ Establishments must be able *authenticate via email*.
    - [ ] - 🧪 It should not be able to authenticate with wrong email.
    - [ ] - 🧪 It should not be able to authenticate with wrong password.
- [ ] - ✨ Establishments must be able to *add a service*.
    - [ ] - 🧪 It should not be able to create service with nonexistent establishmentId.
    - [ ] - 🧪 It should validate service as "Male".
    - [ ] - 🧪 It should validate service as "Female".
    - [ ] - 🧪 It should validate service as "Both".
    - [ ] - 🧪 It should not be allowed to register service gender unless specified as "Male", "Female" or "Both".
    - [ ] - 🧪 It should not be allowed to register service gender as blank.
    - [ ] - 🧪 It should not be allowed to register service with durations that are not multiples of 15 minutes.
    - [ ] - 🧪 It 'should not be allowed to register service with durations under 15 minutes.
- [ ] - ✨ Establishments must be able to *add a professional*.
    - [ ] - 🧪 It should not be able to add professional with nonexistent establishmentId.
- [ ] - ✨ Establishments must be able to *add a schedule*.
    - [ ] - 🧪 It should not be able to add schedule with nonexistent establishmentId.
    - [ ] - 🧪 It should not be able to create a schedule with invalid time format.
    - [ ] - 🧪 It 'should not be able to create a schedule with only null values.
    - [ ] - 🧪 It should not be able to create a schedule with opening time but without a corresponding closing time, and vice versa.
- [ ] - ✨ Establishments must be able to confirm a service booked by a user.
    - [ ] - 🧪 It should allow establishment confirm for service date changes.
- [ ] - ✨ Establishments must be able to cancel a service confirmed.
    - [ ] - 🧪 For each service offered, establishments must specify the gender served (female, male, or both).
- [ ] - ✨ Establishments must be able to check in a user for a confirmed service booked.
- [ ] - ✨ Establishments must be able to check out a user who has paid for and used a booked service.

## Application
- [ ] - ✨ The application must display available establishments appointment times for scheduling.
    - [ ] - 🧪 It should display available time slots based on establishment and professional schedules.
    - [ ] - 🧪 It should prevent booking a service outside of the establishment's operating hours.
    - [ ] - 🧪 It should allow users to book multiple services at the same time if offered by the establishment and time slots do not overlap.

## Additional Ideas
- 🔜 Users can rate and leave comments about establishments and professionals after the service. (Moved from functionality list)
- 🔜 Implement two-factor authentication for added security.
- 🔜 Allow users to share their reservations and experiences on social networks.
- 🔜 Establishments can offer promotional discounts or packages.
- 🔜 Establishments can set flexible cancellation policies.
- 🔜 The application must implement a notification system to remind users of their reservations and notify them of changes or cancellations.
- 🔜 Professionals must be notified of changes or cancellations of bookings as soon as possible.
- 🔜 Cancellation or rescheduling policies should be predefined and clearly communicated to users.
- 🔜 Charge a commission fee (e.g., 4%) on check out bookings to support the platform.
- 🔜 Allow establishments to offer services at the user's location (at-home) or both in-salon and at-home options.
- 🔜 Implement a loyalty program to reward repeat customers (e.g. “book 10 times and get one for free”).
- 🔜 Allow users to search for establishments based on location.
- 🔜 Integrate with payment gateways for secure transactions.
- 🔜 Allow users to filter the list of establishments by location (in-salon or at-home) and other relevant criteria.
- 🔜 Offer multiple languages for a broader user base.
- 🔜 Use recommendation algorithms to suggest establishments based on user preferences and booking history.
- 🔜 It should not allow registration with an invalid email format (e.g., missing @ symbol, invalid domain name).
- 🔜 It should not allow registration with a weak password (e.g., too short, no combination of uppercase/lowercase letters, numbers, and symbols).
- 🔜 It should send a verification email upon registration.
- 🔜 It should allow user to choose serviceGender from a dropdown or selection list instead of directly entering text.
- 🔜 It should lock the account after a certain number of failed login attempts.
- 🔜 It should offer "forgot password" functionality with email verification for password reset.
- 🔜 It should not allow service date change after a specific time-frame (e.g., 24 hours before appointment).
- 🔜 It should notify both user and establishment about service cancellation or date change.
- 🔜 It should allow filtering and sorting of services based on various criteria (e.g., date, status, establishment, professional).
- 🔜 It should display clear and concise information for each service, including service details, confirmation status, and payment status.
- 🔜 It should require verification of establishment details (e.g., business license, contact information) before registration approval.
- 🔜 It should allow adding multiple professionals with different service specializations.
- 🔜 It should allow setting individual professional schedules and availability.
- 🔜 It should provide options for managing service pricing and discounts.
- 🔜 It should allow establishments to view user booking history and preferences.
- 🔜 It should allow communication with users through the platform for appointment confirmations, rescheduling, or other relevant information.

- ⚡ The application should respond quickly to user requests, even under peak conditions.
- ⚡ The application must protect user and establishment data from unauthorized access.
- ⚡ The application interface should be intuitive and easy to use for all types of users.
- ⚡ The application should be available for use most of the time.
- ⚡ The application should be able to accommodate an increasing number of users and bookings.
- ⚡ The application be tested on different devices and operating systems for compatibility and responsiveness.
- ⚡ The application follow accessibility guidelines to ensure usability for users with disabilities.
- ⚡ The application implement data encryption for user information and secure communication protocols.


  // write skew + double booking https://medium.com/@pulkitent/system-design-database-transactions-isolation-levels-concurrency-control-contd-part-2-78db036f6971
  // Designing Data Intensive Applications