# payment-gateway-exercise

### Installation

Requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
$ git clone https://github.com/xmountainx/payment-gateway-exercise.git
$ cd payment-gateway-exercise
$ npm install
$ node .
```

### Services Dependency

- Redis server run on localhost with deafult port 6379 and database index 0
- MongoLab
- Paypal & Braintree payment gateway sandbox

### Data Structure (Payment Record)

Stored in Mongo database and will cached at redis after success check of payment record

| Name | Type | Remark |
| ------ | ------ | ------ |
| paymentId | String | Third party payment gateway return reference code |
| provider | String | The name of payment gateway Provider |
| name | String | Then name of the user who make for the payment |
| phone | String | the phone num of the user who make for the payment |
| currency | String | Currency type which used in the transaction |
| amount | Number | The total amount of the transaction |

### Public accessible URL

| URL | Remark |
| ------  | ------ |
| http://localhost:3000/create-payment | To create a new payment |
| http://localhost:3000/check-payment | To check an existing payment by ref code and user name|

### Sample Data
#### Create Payment - Paypal

| Section | Field | Value |
| ------ | ------  | ------ |
| Order Section | name | test user |
| Order Section | area code | 852 |
| Order Section | phone number | 98765432 |
| Order Section | currency | USD |
| Order Section | price | 100 |
| Payment Section | credit card hodler name | test user |
| Payment Section | credit card number | 378734493671000 |
| Payment Section | credit card expiration | 12/2019 |
| Payment Section | credit card cvv| 000 |

#### Create Payment - Braintree

| Section | Field | Value |
| ------ | ------  | ------ |
| Order Section | name | test user |
| Order Section | area code | 852 |
| Order Section | phone number | 98765432 |
| Order Section | currency | HKD |
| Order Section | price | 100 |
| Payment Section | credit card hodler name | test user |
| Payment Section | credit card number | 4111111111111111 |
| Payment Section | credit card expiration | 12/2019 |
| Payment Section | credit card cvv| 000 |

#### Check Payment

| Section | Field | Value |
| ------ | ------  | ------ |
| Check Form | customer name | user1 |
| Check Form | reference code | PAY-2X465207CJ961892RLCZ6SNA |

