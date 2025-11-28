<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Http\Requests\EventRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\EventAddress;
use App\Models\EventMeeting;
class EventController extends Controller
{
    public function index(Request $request)
    {
        $skip = (int) $request->query('skip', 0);
        $take = (int) $request->query('take', 10);
        $search = $request->query('search');
        $query = Event::with(['address', 'meeting']);
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }
        $events = $query
            ->skip($skip)
            ->take($take)
            ->get();
        return response()->json($events);
    }
    public function Show($id){
        $event = Event::with(['address', 'meeting','attendees'])
                  ->findOrFail($id);
        return response()->json($event);
    }
    public function myEvents(Request $request)
    {
        $userId = $request->user()->id;
        $events = Event::with(['address', 'meeting'])
                    ->where('created_by_user_id', $userId)
                    ->get();

        return response()->json($events);
    }
    public function store(EventRequest $request)
    {
        $data = $request->validated();
        $eventId = Str::uuid()->toString();
        $event = Event::create([
            'id' => $eventId,
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'happening_at' => $data['happening_at'],
            'happening_until' => $data['happening_until'],
            'publish' => $data['publish'] ?? false,
            'max_attendees' => $data['max_attendees'] ?? null,
            'created_by_user_id' => Auth::id(),
            'meetingLinkId' => isset($data['meeting']) ? $eventId : null,
            'addressId' => isset($data['address']) ? $eventId : null,
        ]);

        if (isset($data['meeting'])) {
            EventMeeting::create([
                'id' => $eventId,
                'link' => $data['meeting']['link'],
            ]);
        }

        if (isset($data['address'])) {
            EventAddress::create([
                'id' => $eventId,
                'address_line' => $data['address']['address_line'],
                'city' => $data['address']['city'],
                'postcode' => $data['address']['postcode'],
            ]);
        }
        return response()->json($event->getKey(), 201);
    }
    public function update(EventRequest $request, $id)
    {
        $event = Event::with(['address', 'meeting'])->findOrFail($id);

        if ($event->created_by_user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validated();

        $event->update([
            'name' => $data['name'] ?? $event->name,
            'description' => $data['description'] ?? $event->description,
            'happening_at' => $data['happening_at'] ?? $event->happening_at,
            'happening_until' => $data['happening_until'] ?? $event->happening_until,
            'publish' => $data['publish'] ?? $event->publish,
            'max_attendees' => $data['max_attendees'] ?? $event->max_attendees,
        ]);
        if (isset($data['meeting']['link'])) {
            $event->address?->delete();

            if ($event->meeting) {
                $event->meeting->update(['link' => $data['meeting']['link']]);
            }
            else {
                EventMeeting::create(['id' => $event->id, 'link' => $data['meeting']['link']]);
            }
            $event->update([
                'meetingLinkId' => $event->id,
                'addressId' => null
            ]);
        }
        if (isset($data['address'])) {
            $event->meeting?->delete();

            if ($event->address) {
                $event->address->update($data['address']);
            } 
            else {
                EventAddress::create(array_merge(['id' => $event->id], $data['address']));
            }
            $event->update([
                'addressId' => $event->id,
                'meetingLinkId' => null
            ]);
        }
        return response()->json($event->getKey());
    }
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        if ($event->created_by_user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted']);
    }


    public function attend(Request $request, $id)
    {
        $user = $request->user();
        $event = Event::findOrFail($id);

        if ($event->created_by_user_id === $user->id) {
            return response()->json(['error' => 'You are the organizer of this event'], 400);
        }

        if ($event->max_attendees !== null && 
            $event->attendees()->count() >= $event->max_attendees) 
        {
            return response()->json(['error' => 'Event is full'], 400);
        }

        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are already attending'], 200);
        }

        $event->attendees()->attach($user->id);

        return response()->json(['success' => true]);
    }
    public function cancelAttendance(Request $request, $id)
    {
        $user = $request->user();
        $event = Event::findOrFail($id);

        if (!$event->attendees()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'You are not attending this event'], 400);
        }
        $event->attendees()->detach($user->id);
        return response()->json(['success' => true]);
    }
    public function attending(Request $request)
    {
        $user = $request->user();

        $events = $user->eventsAttending()
            ->with(['address', 'meeting'])
            ->whereDate('starts_at', '>=', today())
            ->get();

        return response()->json($events);
    }
}