# 🗓️ Planify — Event Management Web App

Planify 2.0 is a full-stack event management web application designed to help users create, manage, and attend events easily.  
This repository contains:

- **React + TypeScript** frontend  
- **Laravel** backend API
- **Postgress** database
- **Docker Compose** installs and runs all the services

## Installation and running
<p>If you are in the project root, there is only one command to run: <code>docker compose up -d</code> (-d) runs the container in the background</p>
<p>If you want to refresh and seed the data, run the container in the background first then 
  <code>docker compose exec backend php artisan migrate:fresh --seed</code>
</p>
<p>accessing the app:</p>

| Service                   | URL                                            |
| ------------------------- | ---------------------------------------------- |
| **Frontend (React)**      | [http://localhost:5173](http://localhost:5173) |
| **Backend (Laravel API)** | [http://localhost:8000](http://localhost:8000) |
| **Database (Postgres)** | [http://localhost:5432](http://localhost:5432) |

## Additional Features

##### Authentication
<p>The app uses Laravel Sanctum personal access tokens for API authentication.</p>
<ul>
  <li>Registration and login endpoints return a plain-text API token (created via Sanctum).Which are then passed to React and passed into a user context</li>
  <li>Logout deletes the currently used token (so that single token is revoked). and the data is deleted on the frontend</li>
  <li>use of protected routed using laravel sanctum for the middleware and a user contect for the frontend</li>
</ul>
<p>Example of a login flow:</p>
<p>frontend sends a login request using <code>axios</code> (which I setup in <code>axios-client.ts</code>) and send the request to the api:</p>

```tsx

 const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    if (data.email === '' || data.password === '')
      return;
    axiosClient.post('/auth/login', data)
      .then((res) => {
        if (res.status === 200) {
          login(res.data.token, res.data.userId);
          navigate(from);
        }
        else {
          setServerErrors([res.data.errors]);
        }
      })
      .catch(err => {
        const response = err.response.data;
        if (response?.errors) {
          const flattenedErrors = Object.values(response.errors).flat() as string[];
          setServerErrors(flattenedErrors);
        } else if (response?.error) {
          setServerErrors([response.error]);
        } else {
          setServerErrors(["Unexpected error occurred"]);
        }
      });
  }
```
<p>On the Laravel side:</p>

```php
    public function login(LoginRequest $request){
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'errors' => 'Provided email address or password is incorrect',
            ]);
        }
        $user = Auth::user();
        $token = $user->createToken('auth')->plainTextToken;
        return response(['token' => $token, 'userId' => $user->getKey()]);
    }
```
<p>We create a token for the user and return it to the react app. In the reponse we call the login method on the user context with set the values in localstorage:</p>

```tsx

    const login = (token: string, userId: number) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_id", String(userId));

        setIsAuthenticated(true);
        setUserId(userId);
    };
```

##### Protected Routes
<p>Both the api and the frontend have protected routes that guard them against unauthenticated users</p>
<p>React:</p>
<code>app.tsx</code>

```tsx
  <Route element={<RequireAuth />}>
    <Route path="/Create" element={<CreateEvent />} />
    <Route path="/Edit/:id" element={<EditEvent />} />
    <Route path="/MyEvents" element={<MyEvents />} />
    <Route path="/Attending" element={<Attending />} />
  </Route>
```
<code>RequiredAuth</code>

```tsx
export function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/Login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
```
<p>Here we check if the user is authenticated using my user context on every page that is within the parent route. If they are we let them pass, if not they get redirected to the login page. If the user 
logs in they will get redirected back to the page they wanted to go to. This is done by the <code>from: location</code> as on the login page, I have this
logic:</p>

```tsx
 const from = location.state?.from?.pathname || "/events";
```
<p>if the <code>from</code> state has a value I set it, if not it defaults to the events page </p>
<p>And on the api side we use <code>sanctum middleware</code></p>

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update'])->whereUuid('id');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->whereUuid('id');
    Route::get('/events/my', [EventController::class, 'myEvents']);
    Route::post('/events/{id}/attend', [EventController::class, 'attend'])->whereUuid('id');
    Route::delete('/events/{id}/attend', [EventController::class, 'cancelAttendance'])->whereUuid('id');
    Route::get('/events/attending', [EventController::class, 'attending']);
});
```
##### Attending Events
<p>I have added a feature where users can attend events. This is done by a many to many relational table</p>
<p>On the laravel side I do this by: </p>

```php
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
```
<p>I check if the user is not the organiser and that the event still has space, if both are validated them a many to many row is added.</p>
<p>I return the users attending this event, when I fetch the actual event here:</p>

```php

    public function Show($id){
        $event = Event::with(['address', 'meeting','attendees'])
                  ->findOrFail($id);
        return response()->json($event);
```
<p>All this data <code>with</code> is added on the model:</p>

```php
class Event extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id','name', 'description', 'happening_at', 'happening_until',
        'publish', 'max_attendees', 'created_by_user_id',
        'meetingLinkId', 'addressId'
    ];
    public function meeting(): HasOne
    {
        return $this->hasOne(EventMeeting::class, 'id');
    }

    public function address(): HasOne
    {
        return $this->hasOne(EventAddress::class, 'id');
    }
public function attendees()
{
    return $this->belongsToMany(User::class, 'event_user')
        ->select('users.id', 'users.name')
        ->withTimestamps();
}

```
<p>On the React side I can check this list of users, if the current user is within this list then give them the action to 
  cancel their attendace or give them the option to attend</p>

```tsx
  <div className="my-6">
    <h2 className="text-xl font-semibold mb-2">Attendees ({event.attendees.length})</h2>
    {event.attendees.length === 0 ? (
        <p className="text-gray-500">Be the first to attend!</p>
    ) : (
        <ul className="list-disc ml-6 text-gray-700">
            {event.attendees.map(att => (
                <li key={att.id}>{att.name}</li>
            ))}
        </ul>
    )}
    {
        event.created_by_user_id !== userId ? (<>
            <div className="mt-4">
                {!isAttending ? (
                    <button
                        onClick={handleAttend}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                    >
                        Attend Event
                    </button>
                ) : (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-500/90 transition cursor-pointer"
                    >
                        Cancel Attendance
                    </button>
                )}
            </div>
        </>) : (<></>)
    }
</div>
```
##### Google Maps
<p>If the event is a physical address, I display a google map of where this event is. I obtained a google maps API key which allows me to do this:</p>

```tsx
<iframe
className="w-full min-h-[500px] rounded-md"
loading="lazy"
allowFullScreen
referrerPolicy="no-referrer-when-downgrade"
src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}
&q=${encodeURIComponent(
`${event.address.address_line}, ${event.address.city}, ${event.address.postcode}`
)}`}
/>
```
<p>This displays the google maps of the exact location of the event</p>

## Critical Analysis
- Authenticated is done with localstorage which is vulnerable to XSS attacks. Http only cookies would have been better.
- Many to many table could grow very large and the delte actions are not soft deltes which could slow down the database at scale
- When running docker compose up on my project (on a linux machine), I had permission issue: <code>unable to get image 'planify-20-backend': permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock:</code> which was fixed by running <code>sudo usermod -aG docker $USER</code> and restaring docker. (However this was not an issue when running it on a mac for the first time)

## Conclusion
Planify demonstrates a modern full-stack web application combining:
- React + TypeScript SPA frontend
- Laravel Sanctum API
- Many-to-many event attendance features
- Google Maps address embedding
- Fully-containerised Docker development environment
