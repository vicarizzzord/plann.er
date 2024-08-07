export const getTripResponseExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  destination: 'Paris',
  starts_at: '2024-08-01T10:00:00.000Z',
  ends_at: '2024-08-10T18:00:00.000Z',
  created_at: '2024-07-20T08:30:00.000Z',
  is_confirmed: true,
  participants: [
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'John Doe',
      is_confirmed: true,
      is_owner: true,
      email: 'john.doe@example.com',
      trip_id: '123e4567-e89b-12d3-a456-426614174000'
    }
  ],
  activities: [
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Eiffel Tower Visit',
      occurs_at: '2024-08-02T14:00:00.000Z',
      trip_id: '123e4567-e89b-12d3-a456-426614174000'
    }
  ],
  links: [
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      title: 'Hotel Booking',
      url: 'https://hotelbooking.example.com',
      trip_id: '123e4567-e89b-12d3-a456-426614174000'
    }
  ]
};

export const createTripRequestSchema = {
  destination: 'Paris',
  starts_at: '2024-12-01T10:00:00Z',
  ends_at: '2024-12-10T10:00:00Z',
  owner_name: 'John Doe',
  owner_email: 'john.doe@example.com',
  emails_to_invite: ['guest1@example.com', 'guest2@example.com']
};
