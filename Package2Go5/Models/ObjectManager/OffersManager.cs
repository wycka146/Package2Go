﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace Package2Go5.Models.ObjectManager
{
    public class OffersManager
    {
        private Package2GoEntities db = new Package2GoEntities();
        private RoutesManager routesManager = new RoutesManager();

        public void Create(int itemId, int routeId, int userId)
        {
            Offers offer = new Offers();

            if (db.Routes.Any(r=>r.id == routeId) 
                && db.Items.Any(i => i.id == itemId && i.UsersItems.Any(ui=>ui.user_id == userId)) 
                && !db.Offers.Any(o => o.route_id == routeId && o.item_id == itemId))
            {
                offer.item_id = itemId;
                offer.route_id = routeId;
                offer.date = DateTime.Now;
                offer.status_id = 1;
            }
            db.Offers.Add(offer);
            db.SaveChanges();
        }

        public void Delete(int itemId, int routeId, int userId)
        {
            if (db.Items.Any(i => i.id == itemId && i.UsersItems.Any(ui=>ui.user_id == userId)))
            {
                Offers offer = db.Offers.Where(o => o.item_id == itemId && o.route_id == routeId).First();

                db.Offers.Remove(offer);
            }


            db.SaveChanges();
        }

        public void Update(int id, int status)
        {
            db.Offers.Where(o => o.id == id).First().status_id = status;
            db.SaveChanges();
        }

        public string GetUserOfferedRoutesIds(int UserId)
        {
            //routeId, itemId
            string offers = "";
            int routeId = 0;

            foreach (Offers offer in db.Offers.Where(o => o.Items.UsersItems.Any(ui => ui.user_id == UserId)).OrderBy(o=>o.route_id))
            {
                if (routeId != offer.route_id)
                {
                    if(offers != "")
                        offers += ";";
                    offers += offer.route_id + ":" + offer.item_id + "-" + offer.Items.ItemsRoutes.Count(ir=>ir.route_id == routeId);
                    routeId = offer.route_id;
                }
                else
                    offers += "," + offer.item_id + "-" + offer.Items.ItemsRoutes.Count(ir => ir.route_id == routeId);
            }

            return offers;
        }

        public List<Offers> GetUserOffersList(int userId)
        {
            IEnumerable<Offers> offers = db.Offers.Where(o => o.Routes.UsersRoutes.Any(ur => ur.user_id == userId));

            foreach (Offers offer in offers)
            {
                offer.Routes.from = routesManager.GetOnlyCities(offer.Routes.from);
                offer.Routes.waypoints = offer.Routes.from + "->" + routesManager.GetOnlyCities(offer.Routes.waypoints);
            }

            return offers.ToList();
        }

        public List<Offers> GetUserNewOffers(int userId)
        {
            return db.Offers.Where(o => o.Routes.UsersRoutes.Any(ur => ur.user_id == userId) && o.status_id == 1).ToList();
        }

    }
}