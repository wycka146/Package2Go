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
    
    public partial class OffersStatus
    {
        public OffersStatus()
        {
            this.Offers = new HashSet<Offers>();
        }
    
        public int id { get; set; }
        public string title { get; set; }
    
        public virtual ICollection<Offers> Offers { get; set; }
    }
}
