package com.dal.tourismapp;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.braintreepayments.cardform.view.CardForm;
import com.google.android.material.datepicker.MaterialDatePicker;

public class Payments extends AppCompatActivity {

    Button date;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payments);
        CardForm cardForm = (CardForm) findViewById(R.id.card_form);
        date = findViewById(R.id.date);
        MaterialDatePicker.Builder builder = MaterialDatePicker.Builder.datePicker();
        final MaterialDatePicker picker = builder.build();

        date.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                picker.show(getSupportFragmentManager(), picker.toString());
            }
        });
        cardForm.cardRequired(true)
                .expirationRequired(true)
                .cvvRequired(true)
                .cardholderName(CardForm.FIELD_REQUIRED)
                .postalCodeRequired(false)
                .mobileNumberRequired(false)
                .actionLabel("Purchase")
                .setup(this);

    }
}
