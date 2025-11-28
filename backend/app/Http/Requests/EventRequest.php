<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
            'happening_at' => 'required|date',
            'happening_until' => 'date|after_or_equal:happening_at',
            'publish' => 'boolean',
            'max_attendees' => 'nullable|integer|min:1',
            'address' => 'nullable|array',
            'address.address_line' => 'required_with:address|string|max:255',
            'address.city' => 'required_with:address|string|max:255',
            'address.postcode' => 'required_with:address|string|max:20',
            'meeting' => 'nullable|array',
            'meeting.link' => 'nullable|string|max:255',
        ];
        return $rules;
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->all();

            if (!isset($data['meeting']) && !isset($data['address'])) {
                $validator->errors()->add('base', 'Either meeting_link or address must be provided.');
            }

            if (isset($data['meeting']) && isset($data['address'])) {
                $validator->errors()->add('base', 'Provide only one: meeting_link or address.');
            }
        });
    }
}
