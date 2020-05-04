package com.dal.tourismapp;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.lang.reflect.Array;
import java.util.ArrayList;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.squareup.picasso.Picasso;


public class PlacesAdapter extends RecyclerView.Adapter<PlacesAdapter.MyViewHolder> {
    private ArrayList<String> mPlace;
    private ArrayList<String> mCity;
    private ArrayList<String> mImage_id;
    private ArrayList<String> mImage;
    private ArrayList<String> mProvince;
    private ArrayList<String> mID;
    private Context mcontext;

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView place;
        public TextView city;
        public ImageView image_id;
        public TextView province;

        public MyViewHolder(View v) {
            super(v);
            place = v.findViewById(R.id.place);
            city = v.findViewById(R.id.city);
            image_id = v.findViewById(R.id.image);
            province = v.findViewById(R.id.province);
        }
    }
    public PlacesAdapter(ArrayList<String> Place, ArrayList<String> city, ArrayList<String> Image_id, ArrayList<String> province, ArrayList<String> ID, Context context) {

    mPlace = Place;
    mCity = city;
    mImage_id = Image_id;
    mProvince = province;
    mID = ID;
     mcontext = context;
    }



    @Override
    public void onBindViewHolder(@NonNull PlacesAdapter.MyViewHolder holder, final int position) {

        holder.place.setText(mPlace.get(position));
        holder.city.setText(mCity.get(position));
        Picasso.get().load(mImage_id.get(position)).into(holder.image_id);
        holder.province.setText(mProvince.get(position));
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mcontext, Details.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("ID", mID.get(position));

                mcontext.startActivity(intent);
            }
        });
    }
    //creating my views
    @Override
    public  PlacesAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        //create a new view
        View v =  LayoutInflater.from(parent.getContext()).inflate(R.layout.places_card, parent, false);

        MyViewHolder vh = new MyViewHolder(v);
        return vh;
    }

    @Override
    public int getItemCount() {
        return mCity.size();
    }
}
