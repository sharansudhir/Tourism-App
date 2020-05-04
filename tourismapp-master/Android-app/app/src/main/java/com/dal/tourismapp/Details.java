package com.dal.tourismapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Details extends AppCompatActivity {
    Button book;
    TextView place;
    TextView city;
    TextView desc;
    ImageView image;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);
        book = findViewById(R.id.book);
        place = findViewById(R.id.place);
        city = findViewById(R.id.city);
        desc = findViewById(R.id.desc);
        image = findViewById(R.id.image);
        Intent i = getIntent();
        final String id = i.getStringExtra("ID");
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                getPlacesDetails(id);
            }
        };

        //retrieve data on the Thread.
        Thread thread = new Thread(null, runnable, "background");
        thread.start();

        book.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), Payments.class );
                startActivity(intent);
            }
        });
    }
    public void getPlacesDetails(String id) {
        String url = "http://ec2-54-87-180-69.compute-1.amazonaws.com:5000/getById/" + id;
        System.out.println(url);

        JsonArrayRequest request = new JsonArrayRequest(
                Request.Method.GET, url, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {

                        try {
                            System.out.println(response);

                            //adding jokes from response to an arrayList
                            for(int i=0;i<response.length();i++){
                                JSONObject placeObject = (JSONObject) response.get(i);
                                place.setText(placeObject.getString("place"));
                                city.setText(placeObject.getString("city"));
                                desc.setText(placeObject.getString("desc"));
                                Picasso.get().load(placeObject.getString("image_id")).into(image);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(), "Error retrieving data", Toast.LENGTH_SHORT).show();
            }
        }
        );

        //adding the request to the request Queue
        RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(request);
    }

}
