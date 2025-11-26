<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventMeeting extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'link'];

    public function event()
    {
        return $this->belongsTo(Event::class, 'id');
    }
}
