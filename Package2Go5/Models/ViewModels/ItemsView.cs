﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

namespace Package2Go5.Models.ViewModels
{
    public class ItemsView
    {

        public int id { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "title")]
        public string title { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "delivery_address")]
        public string delivery_address { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "size")]
        public string size { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "delivery_price")]
        public int delivery_price { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "note")]
        public string note { get; set; }

        public List<Routes> routes { get; set; }

        [Display(ResourceType = typeof(Resources.DisplayNames), Name = "currency_id")]
        public int currency_id { get; set; }

        public virtual ICollection<UsersItems> UsersItems { get; set; }

    }
}
