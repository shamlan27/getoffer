<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promotion_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['Promotion', 'Limited-time', 'Festival'])->default('Promotion');
            $table->text('message');
            $table->string('action_url')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_alerts');
    }
};
