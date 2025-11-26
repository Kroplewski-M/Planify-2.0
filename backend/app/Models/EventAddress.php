<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventAddress extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'address_line', 'city', 'postcode'];

    public function event()
    {
        return $this->belongsTo(Event::class, 'id');
    }
}
