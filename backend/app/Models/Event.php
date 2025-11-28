<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
}
