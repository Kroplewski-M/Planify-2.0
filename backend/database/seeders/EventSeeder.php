<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = DB::table('users')->where('email', 'test@example.com')->value('id');

        if (!$userId) {
            echo "Warning: Could not find user. Please run UserSeeder first.\n";
            return;
        }
        //online meetings
        $meetings = [
                    [
                        'name' => 'Weekly Team Sync',
                        'description' => 'Mandatory weekly meeting to discuss project progress and blockers.',
                        'link' => 'https://meet.google.com/abc-defg-hij',
                    ],
                    [
                        'name' => 'Client Kick-off Meeting',
                        'description' => 'First meeting with the new client to define scope and deliverables.',
                        'link' => 'https://zoom.us/j/99912345678',
                    ],
                    [
                        'name' => 'Tech Talk: Laravel Seeding',
                        'description' => 'An internal tech talk on best practices for database seeding in Laravel.',
                        'link' => 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_abcdefg',
                    ],
                ];
        foreach ($meetings as $data) {
            $eventId = (string) Str::uuid();
            $happeningAt = Carbon::now()->addDays(rand(1, 14))->addHours(rand(9, 17))->minute(0)->second(0);

            DB::table('events')->insert([
                'id' => $eventId,
                'name' => $data['name'],
                'description' => $data['description'],
                'happening_at' => $happeningAt,
                'happening_until' => $happeningAt->copy()->addHour(),
                'publish' => true,
                'max_attendees' => 50,
                'created_by_user_id' => $userId,
                'meetingLinkId' => $eventId,
                'addressId' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('event_meetings')->insert([
                'id' => $eventId,
                'link' => $data['link'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        //in person meetins
        $addresses = [
            [
                'name' => 'Annual Developer Conference',
                'description' => 'Our biggest annual conference for all developers and tech enthusiasts.',
                'address_line' => '123 Tech Park Avenue',
                'city' => 'San Francisco',
                'postcode' => 'CA 94107',
            ],
            [
                'name' => 'Office Holiday Party',
                'description' => 'Celebrate the year with food, drinks, and good company!',
                'address_line' => 'The Grand Ballroom, 45 Oxford Street',
                'city' => 'London',
                'postcode' => 'W1D 2DU',
            ],
            [
                'name' => 'Local Community Meetup',
                'description' => 'Informal meetup for local programmers and designers.',
                'address_line' => 'Caffeination Hub, 789 Main Street',
                'city' => 'New York',
                'postcode' => 'NY 10001',
            ],
        ];
        foreach ($addresses as $data) {
            $eventId = (string) Str::uuid();
            $happeningAt = Carbon::now()->addDays(rand(15, 30))->addHours(rand(18, 22))->minute(0)->second(0);

            DB::table('events')->insert([
                'id' => $eventId,
                'name' => $data['name'],
                'description' => $data['description'],
                'happening_at' => $happeningAt,
                'happening_until' => $happeningAt->copy()->addHours(3),
                'publish' => true,
                'max_attendees' => 200,
                'created_by_user_id' => $userId,
                'meetingLinkId' => null,
                'addressId' => $eventId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('event_addresses')->insert([
                'id' => $eventId,
                'address_line' => $data['address_line'],
                'city' => $data['city'],
                'postcode' => $data['postcode'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
