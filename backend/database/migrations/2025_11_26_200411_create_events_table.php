<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50);
            $table->text('description');
            $table->dateTime('happening_at');
            $table->dateTime('happening_until')->nullable();
            $table->boolean('publish')->default(false);
            $table->integer('max_attendees')->nullable();
            $table->foreignId('created_by_user_id')->constrained('users');
            $table->uuid('meetingLinkId')->nullable();
            $table->uuid('addressId')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
