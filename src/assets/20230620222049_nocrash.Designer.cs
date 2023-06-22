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
    [Migration("20230620222049_nocrash")]
    partial class nocrash
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("WebApplication1.Models.ChatLog", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.ToTable("ChatLog");
                });

            modelBuilder.Entity("WebApplication1.Models.ChatMessage", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ChatLogid")
                        .HasColumnType("int");

                    b.Property<string>("content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("timeStamp")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("userid")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("ChatLogid");

                    b.HasIndex("userid");

                    b.ToTable("ChatMessage");
                });

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ChannelName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int?>("ChatLogid")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<int>("Lecturerid")
                        .HasColumnType("int");

                    b.Property<string>("ShareUrl")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("ChatLogid");

                    b.HasIndex("Lecturerid");

                    b.ToTable("LiveLectures");
                });

            modelBuilder.Entity("WebApplication1.Models.Recording", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("LiveLectureClassId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("end")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("resourceId")
                        .HasColumnType("longtext");

                    b.Property<string>("ruid")
                        .HasColumnType("longtext");

                    b.Property<string>("sid")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("start")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("url")
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.HasIndex("LiveLectureClassId");

                    b.ToTable("Recordings");
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

            modelBuilder.Entity("WebApplication1.Models.UserHistory", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("joinDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("lastPingDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("liveLectureId")
                        .HasColumnType("int");

                    b.Property<int>("userid")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("liveLectureId");

                    b.HasIndex("userid");

                    b.ToTable("UserHistories");
                });

            modelBuilder.Entity("WebApplication1.Models.ChatMessage", b =>
                {
                    b.HasOne("WebApplication1.Models.ChatLog", null)
                        .WithMany("content")
                        .HasForeignKey("ChatLogid");

                    b.HasOne("WebApplication1.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.HasOne("WebApplication1.Models.ChatLog", "ChatLog")
                        .WithMany()
                        .HasForeignKey("ChatLogid");

                    b.HasOne("WebApplication1.Models.User", "Lecturer")
                        .WithMany()
                        .HasForeignKey("Lecturerid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ChatLog");

                    b.Navigation("Lecturer");
                });

            modelBuilder.Entity("WebApplication1.Models.Recording", b =>
                {
                    b.HasOne("WebApplication1.Models.LiveLectureClass", null)
                        .WithMany("Recordings")
                        .HasForeignKey("LiveLectureClassId");
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

            modelBuilder.Entity("WebApplication1.Models.UserHistory", b =>
                {
                    b.HasOne("WebApplication1.Models.LiveLectureClass", "liveLecture")
                        .WithMany()
                        .HasForeignKey("liveLectureId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("liveLecture");

                    b.Navigation("user");
                });

            modelBuilder.Entity("WebApplication1.Models.ChatLog", b =>
                {
                    b.Navigation("content");
                });

            modelBuilder.Entity("WebApplication1.Models.LiveLectureClass", b =>
                {
                    b.Navigation("Attendees");

                    b.Navigation("Recordings");

                    b.Navigation("Tags");
                });
#pragma warning restore 612, 618
        }
    }
}
