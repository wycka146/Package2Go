//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Package2Go5
{
    using System;
    using System.Collections.Generic;
    
    public partial class ItemStatus
    {
        public ItemStatus()
        {
            this.Items = new HashSet<Items>();
        }
    
        public int id { get; set; }
        public string title { get; set; }
    
        public virtual ICollection<Items> Items { get; set; }
    }
}