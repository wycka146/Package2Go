﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Package2GoEntities : DbContext
    {
        public Package2GoEntities()
            : base("name=Package2GoEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Currencies> Currencies { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<ItemsRoutes> ItemsRoutes { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<MessagesStatus> MessagesStatus { get; set; }
        public DbSet<Offers> Offers { get; set; }
        public DbSet<OffersStatus> OffersStatus { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Routes> Routes { get; set; }
        public DbSet<RouteStatus> RouteStatus { get; set; }
        public DbSet<sysdiagrams> sysdiagrams { get; set; }
        public DbSet<UserProfile> UserProfile { get; set; }
        public DbSet<UsersItems> UsersItems { get; set; }
        public DbSet<UsersMessages> UsersMessages { get; set; }
        public DbSet<UsersRoutes> UsersRoutes { get; set; }
        public DbSet<vw_routes> vw_routes { get; set; }
        public DbSet<vw_messages> vw_messages { get; set; }
    }
}
