﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApplication1.Models;

#nullable disable

namespace EduAPI.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20230618171415_Initial4")]
    partial class Initial4
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ChannelName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<int>("Lecturerid")
                        .HasColumnType("int");

                    b.Property<string>("RecordingLink")
                        .HasColumnType("longtext");

                    b.Property<string>("ShareUrl")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Lecturerid");

                    b.ToTable("LiveLectures");
                });

            modelBuilder.Entity("WebApplication1.Models.Tag", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("LiveLectureClassId")
                        .HasColumnType("int");

                    b.Property<string>("tag_name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.HasIndex("LiveLectureClassId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("WebApplication1.Models.User", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("LiveLectureClassId")
                        .HasColumnType("int");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("id_number")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte[]>("password_hash")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<byte[]>("password_salt")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("token")
                        .HasColumnType("longtext");

                    b.Property<string>("username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.HasIndex("LiveLectureClassId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.HasOne("WebApplication1.Models.User", "Lecturer")
                        .WithMany()
                        .HasForeignKey("Lecturerid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lecturer");
                });

            modelBuilder.Entity("WebApplication1.Models.Tag", b =>
                {
                    b.HasOne("WebApplication1.Models.LiveLectureClass", null)
                        .WithMany("Tags")
                        .HasForeignKey("LiveLectureClassId");
                });

            modelBuilder.Entity("WebApplication1.Models.User", b =>
                {
                    b.HasOne("WebApplication1.Models.LiveLectureClass", null)
                        .WithMany("Attendees")
                        .HasForeignKey("LiveLectureClassId");
                });

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.Navigation("Attendees");

                    b.Navigation("Tags");
                });
#pragma warning restore 612, 618
        }
    }
}
