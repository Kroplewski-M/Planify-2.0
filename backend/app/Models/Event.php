<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name', 'description', 'happening_at', 'happening_until',
        'publish', 'max_attendees', 'created_by_user_id',
        'meetingLinkId', 'addressId'
    ];
    public function meeting(): bool
    {
        return $this->hasOne(EventMeeting::class, 'id');
    }

    public function address(): bool
    {
        return $this->hasOne(EventAddress::class, 'id');
    }
}
