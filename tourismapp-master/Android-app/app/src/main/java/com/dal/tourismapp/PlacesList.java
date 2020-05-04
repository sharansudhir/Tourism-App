package com.dal.tourismapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PlacesList extends AppCompatActivity {
    private RecyclerView recycle_view;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;

    private ArrayList<String> place;
    private ArrayList<String> city;
    private ArrayList<String> image_id;
    private ArrayList<String> province;
    private ArrayList<String> id;
    private JSONArray placesArray;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_places_list);


        recycle_view = findViewById(R.id.recycler_view);
        recycle_view.setHasFixedSize(true);

        layoutManager = new LinearLayoutManager(this);
        recycle_view.setLayoutManager(layoutManager);

        place = new ArrayList<>();
        city = new ArrayList<>();
        image_id = new ArrayList<>();
        province = new ArrayList<>();
        id = new ArrayList<>();
        placesArray = new JSONArray();
        final String keyword = getIntent().getStringExtra("keyword");
        //create a thread for fetching jokes
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                getPlaces(keyword);
            }
        };

        //retrieve data on the Thread.
        Thread thread = new Thread(null, runnable, "background");
        thread.start();


        mAdapter = new PlacesAdapter(place, city, image_id, province, id, getApplicationContext());
        recycle_view.setAdapter(mAdapter);
    }
    public void getPlaces(String keyword) {
        System.out.println("Akash 2");
         String url = "http://ec2-54-87-180-69.compute-1.amazonaws.com:5000/" + keyword;

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
                                    place.add(placeObject.getString("place"));
                                    city.add(placeObject.getString("city"));
                                    image_id.add(placeObject.getString("image_id"));
                                    province.add(placeObject.getString("province"));
                                    id.add(placeObject.getString("id"));
                                }
                                //notify to refresh the view related to the dataSet
                                mAdapter.notifyDataSetChanged();
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
